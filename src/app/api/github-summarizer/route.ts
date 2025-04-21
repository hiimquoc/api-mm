import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { createClient } from '@supabase/supabase-js'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { JsonOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

// Define the output schema
const summarySchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  coolFacts: z.array(z.string()).describe("Interesting facts about the repository")
})

// Create the prompt template
const prompt = PromptTemplate.fromTemplate(`
Summarize this GitHub repository based on its README content:

{readme}

Provide a summary and list some cool facts about the repository.
Format your response as a JSON object with two fields:
1. "summary": A string containing a concise summary
2. "coolFacts": An array of strings containing interesting facts
`)

// Create the LLM chain
const chain = RunnableSequence.from([
  {
    readme: (input: { readme: string }) => input.readme
  },
  prompt,
  new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEY,
  }),
  new JsonOutputParser()
])

export async function POST(request: Request) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      )
    }

    // Validate API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    if (apiKeyError || !apiKeyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Get repo URL from request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error('JSON parsing error:', error)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object' },
        { status: 400 }
      )
    }

    const repoUrl = body.url
    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json(
        { error: 'Repository URL is required and must be a string' },
        { status: 400 }
      )
    }

    // Extract owner and repo from URL
    const urlParts = repoUrl.split('/')
    if (urlParts.length < 2) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
        { status: 400 }
      )
    }

    const owner = urlParts[urlParts.length - 2]
    const repo = urlParts[urlParts.length - 1]

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Could not extract owner and repository name from URL' },
        { status: 400 }
      )
    }

    // Fetch README content
    const { data: readme } = await octokit.repos.getReadme({
      owner,
      repo,
    })

    const readmeContent = Buffer.from(readme.content, 'base64').toString()

    // Use LangChain to summarize the README
    const result = await chain.invoke({
      readme: readmeContent
    })

    // Validate the output against our schema
    const validatedResult = summarySchema.parse(result)

    return NextResponse.json(validatedResult)
  } catch (error) {
    console.error('Error in GitHub summarizer:', error)
    return NextResponse.json(
      { error: 'Failed to process repository README' },
      { status: 500 }
    )
  }
} 