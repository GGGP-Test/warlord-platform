import { ApifyClient } from 'apify-client';
import OpenAI from 'openai';

interface CompanyProfile {
  name: string;
  industry: string;
  size: 'Small' | 'Medium' | 'Large';
  location: string;
  products: string[];
  confidence: number;
}

/**
 * Extract company profile using cascade strategy
 * @param domain - Company domain
 * @param tier - Which tier to use: FREE | CHEAP | EXPENSIVE
 */
export async function extractCompanyProfile(
  domain: string,
  tier: 'FREE' | 'CHEAP' | 'EXPENSIVE'
): Promise<CompanyProfile | null> {
  switch (tier) {
    case 'FREE':
      return await extractWithGoogleSearch(domain);
    case 'CHEAP':
      return await extractWithApify(domain);
    case 'EXPENSIVE':
      return await extractWithGPT4(domain);
    default:
      throw new Error(`Invalid tier: ${tier}`);
  }
}

/**
 * TIER 1: FREE - Google Custom Search API
 * Cost: $0 (100 queries/day free)
 * Confidence: 0.5-0.7 for structured data
 */
async function extractWithGoogleSearch(domain: string): Promise<CompanyProfile | null> {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const engineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

  if (!apiKey || !engineId) {
    throw new Error('Google Custom Search not configured');
  }

  try {
    const query = `site:${domain} OR "${domain}" company profile`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No results found');
    }

    // Extract basic info from search results
    const firstResult = data.items[0];
    const title = firstResult.title || '';

    // Simple extraction logic (production would be more sophisticated)
    const profile: CompanyProfile = {
      name: extractCompanyName(domain, title) || domain,
      industry: 'Unknown',
      size: 'Medium',
      location: 'Unknown',
      products: [],
      confidence: 0.5, // Low confidence from basic search
    };

    return profile;
  } catch (error) {
    console.error('Google Search extraction failed:', error);
    return null;
  }
}

/**
 * TIER 2: CHEAP - Apify Web Scraper
 * Cost: ~$0.05 per scrape
 * Confidence: 0.6-0.8 for well-structured sites
 */
async function extractWithApify(domain: string): Promise<CompanyProfile | null> {
  const apiToken = process.env.APIFY_API_TOKEN;

  if (!apiToken) {
    throw new Error('Apify not configured');
  }

  try {
    const client = new ApifyClient({ token: apiToken });

    // Run web scraper actor
    const run = await client.actor('apify/web-scraper').call({
      startUrls: [{ url: `https://${domain}` }],
      maxCrawlDepth: 1,
      maxCrawlPages: 3,
    });

    // Get results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      throw new Error('No data scraped');
    }

    // Extract text content
    const text = items.map((item: any) => item.text).join(' ');

    // Basic extraction (production would use more sophisticated parsing)
    const profile: CompanyProfile = {
      name: extractCompanyName(domain, text) || domain,
      industry: extractIndustry(text),
      size: 'Medium',
      location: extractLocation(text),
      products: extractProducts(text),
      confidence: 0.7,
    };

    return profile;
  } catch (error) {
    console.error('Apify extraction failed:', error);
    return null;
  }
}

/**
 * TIER 3: EXPENSIVE - GPT-4 Deep Extraction
 * Cost: ~$0.20 per analysis (after Apify scrape)
 * Confidence: 0.8-0.95 for any content
 */
async function extractWithGPT4(domain: string): Promise<CompanyProfile | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI not configured');
  }

  try {
    // First, scrape with Apify to get raw content
    const scrapedData = await extractWithApify(domain);
    if (!scrapedData) {
      throw new Error('Failed to scrape website');
    }

    // Then enhance with GPT-4
    const openai = new OpenAI({ apiKey });

    const prompt = `Analyze this company information and extract structured data:

Domain: ${domain}
Initial extraction: ${JSON.stringify(scrapedData)}

Provide a detailed company profile in JSON format with these fields:
- name: Company name
- industry: Primary industry (be specific)
- size: Small (<50 employees), Medium (50-500), or Large (>500)
- location: Primary location
- products: Array of main products/services
- confidence: Your confidence score (0-1)

Respond with ONLY valid JSON, no other text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from GPT-4');
    }

    const profile = JSON.parse(response) as CompanyProfile;
    return profile;
  } catch (error) {
    console.error('GPT-4 extraction failed:', error);
    return null;
  }
}

// Helper functions for basic extraction
function extractCompanyName(domain: string, text: string): string | null {
  // Simple heuristic: capitalize domain name
  const name = domain.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function extractIndustry(text: string): string {
  const industries = ['Manufacturing', 'Technology', 'Healthcare', 'Finance', 'Retail'];
  for (const industry of industries) {
    if (text.toLowerCase().includes(industry.toLowerCase())) {
      return industry;
    }
  }
  return 'Unknown';
}

function extractLocation(text: string): string {
  // Very basic location extraction
  const locationPattern = /\b([A-Z][a-z]+,\s*[A-Z]{2})\b/;
  const match = text.match(locationPattern);
  return match ? match[0] : 'Unknown';
}

function extractProducts(text: string): string[] {
  // Placeholder - production would use NLP
  return [];
}
