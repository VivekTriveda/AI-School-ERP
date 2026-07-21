function splitIntoChapters(text) {

    const regex =
/(?:^|\n)\s*((?:CHAPTER|Chapter|UNIT|Unit|LESSON|Lesson)\s*[A-Za-z0-9IVXivx]+[:.\-\s]*.*?)(?=\n\s*(?:CHAPTER|Chapter|UNIT|Unit|LESSON|Lesson)\s*[A-Za-z0-9IVXivx]+|\s*$)/gs;

    const chapters = [];

    let match;

    let chapterNo = 1;

    while ((match = regex.exec(text)) !== null) {

        chapters.push({

            chapterNo,

            chapterName: match[1].split("\n")[0].trim(),

            text: match[0].trim()

        });

        chapterNo++;
    }

    // Fallback if chapter not detected

    if (chapters.length === 0) {

    console.log("No chapters detected. Splitting into chunks...");

    const chunkSize = 60000; // characters

    let chapterNo = 1;

    for (let i = 0; i < text.length; i += chunkSize) {

        chapters.push({

            chapterNo,

            chapterName: `Part ${chapterNo}`,

            text: text.substring(i, i + chunkSize)

        });

        chapterNo++;

    }

}

    return chapters;
}

module.exports = splitIntoChapters;