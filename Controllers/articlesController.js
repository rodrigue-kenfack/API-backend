const db = require('../database');

// CREATE
exports.createArticle = (req, res) => {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;

    if (!titre || !contenu || !auteur) {
        return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const sql = `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [titre, contenu, auteur, date, categorie, tags], function(err) {
        if (err) return res.status(500).json(err);

        res.status(201).json({ id: this.lastID, message: "Article créé" });
        });
};

// READ ALL
exports.getArticles = (req, res) => {
    const { categorie, auteur, date } = req.query;

    let sql = "SELECT * FROM articles WHERE 1=1";
    let params = [];

    if (categorie) {
        sql += " AND categorie=?";
        params.push(categorie);
    }

    if (auteur) {
        sql += " AND auteur=?";
        params.push(auteur);
    }

    if (date) {
        sql += " AND date=?";
  params.push(date);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
};

// READ ONE
exports.getArticleById = (req, res) => {
    db.get("SELECT * FROM articles WHERE id=?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json(err);
        if (!row) return res.status(404).json({ message: "Article non trouvé" });

        res.json(row);
         });
};

// UPDATE
exports.updateArticle = (req, res) => {
    const { titre, contenu, categorie, tags } = req.body;

    const sql = `UPDATE articles SET titre=?, contenu=?, categorie=?, tags=? WHERE id=?`;

    db.run(sql, [titre, contenu, categorie, tags, req.params.id], function(err) {
        if (err) return res.status(500).json(err);

        res.json({ message: "Article mis à jour" });
    });
};

// DELETE
exports.deleteArticle = (req, res) => {
    db.run("DELETE FROM articles WHERE id=?", [req.params.id], function(err) {
        if (err) return res.status(500).json(err);

        res.json({ message: "Article supprimé" });
    });
};

// SEARCH
exports.searchArticles = (req, res) => {
    const query = `%${req.query.query}%`;

    db.all(
        "SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?",
        [query, query],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }

    );
};
//fin de controllers.js
