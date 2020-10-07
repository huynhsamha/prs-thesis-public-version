db.Session.updateMany(
    {"activeTime" : ISODate("2020-07-19T17:00:00Z")},
    {
        $set: {
            "activeTime" : ISODate("2020-07-26T17:00:00Z"),
            "finishTime" : ISODate("2020-07-27T17:00:00Z")
        }
    }
)
