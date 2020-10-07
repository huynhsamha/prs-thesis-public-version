db.Session.find({"cnpm": "3006"})

db.Session.updateMany(
    {"cnpm" : "3006"},
    {
        $set: {
            "activeTime" : ISODate("2020-07-29T17:00:00Z"),
            "finishTime" : ISODate("2020-09-15T17:00:00Z")
        }
    }
)

db.Session.updateMany(
    {"cnpm" : "3005"},
    {
        $set: {
            "editorID" : ObjectId("5f203a0557af5d7c576afb4d")
        }
    }
)

db.Session.updateMany(
    {"cnpm" : "3005"},
    {
        $set: {
            "activeTime" : ISODate("2020-08-05T17:00:00Z"),
            "finishTime" : ISODate("2020-08-08T17:00:00Z")
        }
    }
)
