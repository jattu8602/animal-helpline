import { OpenAI } from "openai"
import { ANIMAL_INJURY_ANALYSIS_PROMPT } from "@/lib/ai-prompt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set")
      return NextResponse.json(
        { error: "AI analysis is not configured. Please contact the administrator." },
        { status: 500 },
      )
    }

    // Lazy-create the OpenAI client so that builds don't fail if the key is missing
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: ANIMAL_INJURY_ANALYSIS_PROMPT,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image for animal injuries." },
            {
              type: "image_url",
              image_url: {
                url: image, // Base64 or URL
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    const analysis = JSON.parse(content)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
