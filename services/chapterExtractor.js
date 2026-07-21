function extractChapters(pdfText) {

    const regex =
/(?:^|\n)\s*((?:CHAPTER|Chapter|UNIT|Unit|LESSON|Lesson)\s*[A-Za-z0-9IVXivx]+[:.\-\s]*.*?)(?=\n\s*(?:CHAPTER|Chapter|UNIT|Unit|LESSON|Lesson)\s*[A-Za-z0-9IVXivx]+|\s*$)/gs;;

    const matches = [...pdfText.matchAll(regex)];

    if (matches.length === 0) {

        return [
            {
                title: "Full Book",
                content: pdfText
            }
        ];

    }

    const chapters = [];

    for (let i = 0; i < matches.length; i++) {

        const start = matches[i].index;

        const end = i + 1 < matches.length
            ? matches[i + 1].index
            : pdfText.length;

        chapters.push({

            title: matches[i][0],

            content: pdfText.substring(start, end)

        });

    }

    return chapters;

}

module.exports = extractChapters;