import google.generativeai as genai
from google import genai as google_genai
from google.genai import types
from openai import OpenAI
import requests
import urllib.parse
import cloudinary
import cloudinary.uploader
from app.core.config import settings
import io

# Configure Gemini (Old SDK for Pollinations prompt enhancement)
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# Configure OpenAI
openai_client = None
if settings.OPENAI_API_KEY:
    openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Configure Cloudinary
if settings.CLOUDINARY_CLOUD_NAME:
    cloudinary.config( 
        cloud_name = settings.CLOUDINARY_CLOUD_NAME, 
        api_key = settings.CLOUDINARY_API_KEY, 
        api_secret = settings.CLOUDINARY_API_SECRET 
    )

def generate_image(prompt: str, provider: str = "pollinations") -> str:
    if provider == "gemini":
        return _generate_with_gemini(prompt)
    elif provider == "openai":
        return _generate_with_openai(prompt)
    else:
        return _generate_with_pollinations(prompt)

def _generate_with_pollinations(prompt: str) -> str:
    # Enhance prompt with Gemini if available, else use raw
    enhanced_prompt = prompt
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(f"Enhance this prompt for an AI image generator to design a home: {prompt}")
        enhanced_prompt = response.text
    except Exception as e:
        print(f"Gemini enhancement failed, using raw prompt: {e}")

    encoded_prompt = urllib.parse.quote(enhanced_prompt[:500])
    return f"https://image.pollinations.ai/prompt/{encoded_prompt}"

def _generate_with_gemini(prompt: str) -> str:
    try:
        client = google_genai.Client(api_key=settings.GEMINI_API_KEY)
        
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp-image-generation',
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt)])],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
                image_config=types.ImageConfig(image_size="1K"),
            )
        )
        
        # The new SDK returns inline data for images
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                image_bytes = part.inline_data.data
                
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image_bytes,
                    folder="zcode",
                    resource_type="image"
                )
                return upload_result["secure_url"]
                
        return "https://via.placeholder.com/1024x1024?text=Gemini+No+Image+Returned"

    except Exception as e:
        print(f"Gemini Native image gen failed: {e}")
        # Fallback to Pollinations if native fails (e.g. model not available or quota)
        return _generate_with_pollinations(f"{prompt} (Gemini Native Failed)")

def _generate_with_openai(prompt: str) -> str:
    if not openai_client:
        return "https://via.placeholder.com/1024x1024?text=OpenAI+Key+Missing"
    
    try:
        response = openai_client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url
    except Exception as e:
        print(f"OpenAI image gen failed: {e}")
        return f"https://via.placeholder.com/1024x1024?text=OpenAI+Failed"
