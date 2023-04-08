export type Blog = {
	path: string;
	attr: BlogAttr;
};

export type BlogAttr = {
	title: string;
	author: string;
	time: Date;
	tags: string[];
	hidden: boolean | undefined;
};
