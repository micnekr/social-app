db = db.getSiblingDB("socialApp");

db.createUser({
  user: "NAME",
  pwd: "PASSWORD",
  roles: [
    {
      role: "readWrite",
      db: "socialApp",
    },
  ],
});
