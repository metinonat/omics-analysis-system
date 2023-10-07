db = db.getSiblingDB("omics-db");

db.createUser({
	user: "api",
	pwd: "o230D3kfas9",
	roles: [
		{
			role: "readWrite",
			db: "omics-db",
		},
	],
});

db.createCollection("omics");
db.createCollection("samples");
