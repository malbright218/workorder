var db = require("../models");

module.exports = function (app) {

    app.get("/api/user", function (req, res) {
        db.User.findAll({
            include: [db.WorkOrders]
        }).then(function (data) {
            res.json(data)
        });
    });

    app.post("/api/user", function (req, res) {
        db.User.create(req.body).then(function (data) {
            res.json(data)
        })
    })
    
    app.put("/api/user", function (req, res) {
        db.User.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbPost) {
                res.json(dbPost);
            });
    });

    app.get("/api/user/:id", function(req, res) {
        db.User.findOne({
            where: {
                id: req.params.id
            },
            include: [db.WorkOrders]
        }).then(function(x) {
            res.json(x)
        })
    })

    app.post("/api/orders", function (req, res) {
        db.WorkOrders.create(req.body).then(function (data) {
            res.json(data)
        })
    })

    app.get("/api/orders", function (req, res) {
        db.WorkOrders.findAll({}).then(function (data) {
            res.json(data)
        });
    });

    app.get("/api/actives", function(req,res) {
        db.WorkOrders.findAll({
            where: {
                [db.or]: [{status: 'active'}, {status: 'late'}]
            }
        })
    })

    app.put("/api/orders", function (req, res) {
        console.log(req)
        db.WorkOrders.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }).then(function (dbPost) {
                res.json(dbPost);
            });
    });

    app.delete("/api/orders/:id", function(req, res) {
        db.WorkOrders.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(function(dbPost) {
            res.json(dbPost);
          });
      });
    
    
};