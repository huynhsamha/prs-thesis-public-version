db.Session.updateMany(
    {"activeTime" : ISODate("2020-07-26T17:00:00Z")},
    {
        $set: {
            "isCSE": true
        }
    }
)
