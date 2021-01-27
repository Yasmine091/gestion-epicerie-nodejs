// Express
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');

// SQLite
const sqlite3 = require('sqlite3').verbose();

// open database
let db = new sqlite3.Database('./db/grocery.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err)
    {
        return console.error(err.message);
    }
    console.log('Connected to the Grocery SQlite database.');
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// *** DATA *** //
let formData = {
    id: null,
    name: '',
    thumbnail_url: '',
    desc: '',
    price: 0,
    quantity: 0
};

// Initialize the database first, only needed at first launch
// initDB();


// *** ROUTES *** //
/**
 * index page
 */
app.get('/', (req, res) => {
    res.render('pages/index');
});

/**
 * products page
 */
app.get('/products', (req, res) => {
    const query = `SELECT * FROM products`;
    db.all(query, [], (err, rows) => {
        if (err)
        {
            console.error(err.message);
        }

        res.render('pages/products', {
            products: rows
        });
    });
});

app.get('/fresh', (req, res) => {
    const query = `SELECT * FROM fresh_products`;
    db.all(query, [], (err, rows) => {
        if (err)
        {
            console.error(err.message);
        }

        res.render('pages/fresh', {
            fresh_products: rows
        });
    });
});

/**
 * about page
 */
app.get('/about', (req, res) => {
    res.render('pages/about');
});

/**
 * inventory page
 */
app.get('/inventory', (req, res) => {
    renderInventory(res);
});

app.get('/inventory/newProduct', (req, res) => {
    resetFormData();
    renderInventory(res, true, false);
});

app.get('/inventory/newFresh', (req, res) => {
    resetFormData();
    renderInventory(res, false, true);
});

// *** CRUD *** //
/**
 * create product
 */
app.post('/inventory/product/create', (req, res) => {
    const query = `INSERT INTO products (name, thumbnail_url, info, price, quantity)
        VALUES ('${req.body.inputName}', 
            '${req.body.inputThumbNail}',
            '${req.body.inputDesc}',
            ${req.body.inputPrice},
            ${req.body.inputQuantity}
        )`;

    db.run(query, (err) => {
        if (err)
        {
            return console.error('ici: ', err.message);
        }
        console.log('Products successfully created.');

        renderInventory(res);
    });
});

/**
 * create fresh product
 */
app.post('/inventory/fresh/create', (req, res) => {
    const query = `INSERT INTO fresh_products (name, thumbnail_url, info, price, quantity, dlc)
        VALUES ('${req.body.inputName}', 
            '${req.body.inputThumbNail}',
            '${req.body.inputDesc}',
            ${req.body.inputPrice},
            ${req.body.inputQuantity},
            ${Date.parse(req.body.inputDLC)}
        )`;

    db.run(query, (err) => {
        if (err)
        {
            return console.error('ici: ', err.message);
        }
        console.log('Fresh products successfully created.');

        renderInventory(res);
    });
});

/**
 * read product
 */
app.get('/inventory/product/:id', (req, res) => {
    if (isNaN(req.params.id))
    {
        return;
    }

    const query = `SELECT * FROM products WHERE id = ${req.params.id}`;
    db.all(query, [], (err, rows) => {
        if (err)
        {
            console.error(err.message);
        }

        if (!rows)
        {
            renderInventory(res);
            return;
        }

        const data = rows[0];

        formData = {
            id: data.id,
            name: data.name,
            thumbnail_url: data.thumbnail_url,
            desc: data.info,
            price: data.price,
            quantity: data.quantity
        }

        res.render('pages/inventory', {
            products: rows,
            fresh_products: rows,
            formData: formData,
            showCreateProduct: false,
            showUpdateProduct: true,
            showCreateFresh: false,
            showUpdateFresh: false
        });
    });
});

app.get('/inventory/fresh/:id', (req, res) => {
    if (isNaN(req.params.id))
    {
        return;
    }

    const query = `SELECT * FROM fresh_products WHERE id = ${req.params.id}`;
    db.all(query, [], (err, rows) => {
        if (err)
        {
            console.error(err.message);
        }

        if (!rows)
        {
            renderInventory(res);
            return;
        }

        const data = rows[0];

        formData = {
            id: data.id,
            name: data.name,
            thumbnail_url: data.thumbnail_url,
            desc: data.info,
            price: data.price,
            quantity: data.quantity,
            dlc: data.dlc
        }

        res.render('pages/inventory', {
            fresh_products: rows,
            products: rows,
            formData: formData,
            showCreateFresh: false,
            showUpdateFresh: true,
            showCreateProduct: false,
            showUpdateProduct: false
        });
    });
});

/**
 * update product
 */
app.post('/inventory/update/product/:id', (req, res) => {
    const query = `UPDATE products
        SET name = '${req.body.inputName}',
        thumbnail_url = '${req.body.inputThumbNail}',
        info = '${req.body.inputDesc}',
        price = ${req.body.inputPrice},
        quantity = ${req.body.inputQuantity}
        WHERE id = ${req.params.id}
        `;

    db.run(query, (err) => {
        if (err)
        {
            return console.error(err.message);
        }
        console.log('Products successfully updated.');

        resetFormData();

        renderInventory(res);
    });
});

/**
 * update fresh
 */
app.post('/inventory/update/fresh/:id', (req, res) => {
    const query = `UPDATE fresh_products
        SET name = '${req.body.inputName}',
        thumbnail_url = '${req.body.inputThumbNail}',
        info = '${req.body.inputDesc}',
        price = ${req.body.inputPrice},
        quantity = ${req.body.inputQuantity},
        dlc = ${Date.parse(req.body.inputDLC)}
        WHERE id = ${req.params.id}
        `;

    db.run(query, (err) => {
        if (err)
        {
            return console.error(err.message);
        }
        console.log('Fresh products successfully updated.');

        resetFormData();

        renderInventory(res);
    });
});

/**
 * delete product
 */
app.get('/inventory/delete/product/:id', (req, res) => {
    if (isNaN(req.params.id))
    {
        return;
    }

    const query = `DELETE FROM products WHERE id = ${req.params.id};`;

    db.run(query, (err) => {
        if (err)
        {
            return console.error(err.message);
        }
        console.log('Products successfully deleted.');

        renderInventory(res);
    });
});

/**
 * delete fresh
 */
app.get('/inventory/delete/fresh/:id', (req, res) => {
    if (isNaN(req.params.id))
    {
        return;
    }

    const query = `DELETE FROM fresh_products WHERE id = ${req.params.id};`;

    db.run(query, (err) => {
        if (err)
        {
            return console.error(err.message);
        }
        console.log('Fresh products successfully deleted.');

        renderInventory(res);
    });
});

/**
 * Listen for connections
 */
app.listen(port, () => {
    console.log(`Epicerie app listening at http://localhost:${port}`)
});

// *** QUERIES *** //

/**
 * Create the table products
 */
function initDB() {
    const query = `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        thumbnail_url TEXT NOT NULL,
        info TEXT NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL
    )`;

    db.run(query, (err) => {
        if (err)
        {
            return console.error(err.message);
        }
        console.log('Table products successfully created.');
        populateDB();
    });
}

/**
 * Add default products to the table products
 */
function populateDB() {
    const query = `INSERT INTO products (name, thumbnail_url, info, price, quantity)
        VALUES ('Pepito', 
        'https://cdn.mcommerce.franprix.fr/product-images/3017760314497_A1L1_s03',
        'Pépito La Boîte A Goûter 540g',
        5, 10)`;

    db.run(query, (err) => {
        if (err)
        {
            return console.error(err.message);
        }
        console.log('Table products successfully populated.');
    });
}

// *** UTILITIES *** //
function renderInventory(res, showCreateProduct = false, showCreateFresh = false) {
    resetFormData();

    if (showCreateProduct || showCreateFresh)
    {
        res.render('pages/inventory', {
            products: [],
            formData: formData,
            showCreateProduct: showCreateProduct,
            showUpdateProduct: false,
            fresh_products: [],
            showCreateFresh: showCreateFresh,
            showUpdateFresh: false
        });

        return;
    }

    const query = `SELECT *, products.id as po_id, fresh_products.id as fr_id,
    products.name as po_name, fresh_products.name as fr_name,
    products.thumbnail_url as po_thumbnail_url, fresh_products.thumbnail_url as fr_thumbnail_url,
    products.info as po_info, fresh_products.info as fr_info,
    products.price as po_price, fresh_products.price as fr_price,
    products.quantity as po_quantity, fresh_products.quantity as fr_quantity
    FROM products, fresh_products`;
    db.all(query, [], (err, rows) => {
        if (err)
        {
            console.error('here: ', err.message);
        }

        res.render('pages/inventory', {
            products: rows,
            formData: formData,
            showCreateProduct: showCreateProduct,
            showUpdateProduct: false,
            fresh_products: rows,
            showCreateFresh: showCreateFresh,
            showUpdateFresh: false
        });
    });
}


function resetFormData() {
    formData = {
        id: null,
        name: '',
        thumbnail_url: '',
        desc: '',
        price: 0,
        dlc: ''
    };
}
