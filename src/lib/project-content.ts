import fs from "fs/promises";
import path from "path";

export async function getProjectMarkdown(projectId: string): Promise<string | null> {
    try {
        // Looks for files in src/data/content/[id].md
        const filePath = path.join(process.cwd(), "src", "data", "content", `${projectId}.md`);
        return await fs.readFile(filePath, "utf8");
    } catch (error) {
        return null;
    }
}
