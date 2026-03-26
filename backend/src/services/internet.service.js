import { tavily } from "@tavily/core";

const tvly = new tavily({
    apiKey: process.env.TAVILY_API_KEY,
})

export async function searchInternet({ query }) {
    try {
        // tavily api called
        const response = await tvly.search(query, {
            includeAnswer: true,
            maxResults: 5,
            searchDepth: "basic"
        })

        // return search results
        return {
            source: 'tavily',
            success: true,
            result: response.results,
            data: response.answer
        }
    }
    catch (error) {
        console.warn('⚠️ Tavily failed, trying DuckDuckGo:', error.message);

        // Fallback to DuckDuckGo
        try {
            return await searchWithDuckDuckGo(query);
        } catch (ddgError) {
            console.warn('⚠️ DuckDuckGo also failed:', ddgError.message);
            return {
                success: false,
                source: 'none',
                results: [],
                answer: null
            }
        }
    }
}

// fallback search function
async function searchWithDuckDuckGo(query) {
   
    try {
        // ddg dynamic import
        const { search } = await import("ddg-search");

        // searching through duckduckgo
        const results = await search(query, {
            safeSearch: 'moderate'  // Safe search enable 
        });

        // DuckDuckGo returns object, not array
        // Extract results array from object
        const resultArray = Array.isArray(results) 
            ? results 
            : (results.results || results.data || []);

        // return top 5 search results
        return {
            success: true,
            source: 'duckduckgo',
            results: resultArray.slice(0, 5)
        }

    }
    catch (error) {
        console.error('❌ Both searches failed:', error);
        throw new Error('Internet search unavailable');
    }

}
