const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// The poem parameter is the text in the paragraph
// Returns the id of the poem
async function savePoem(poem, keywords) {
	const poemEntry = await prisma.poem.create({
		data: {
			paragraph: poem,
			keywords: keywords
		}
	});

	return poemEntry.id;
}

// Give the id of the poem
// Returns "null" if the query didn't succeed.
async function getPoem(id) {
	const poem = await prisma.poem.findUnique({
		where: {
			id: id
		}
	});

	if (poem == null) {
		return null;
	}

	return {
		paragraph: poem.paragraph,
		keywords: poem.keywords
	}
}

module.exports = {
	savePoem,
	getPoem
}