import app from './expressApp';
import db from './knex';

// db.migrate.latest();

const port = 4000;

app.listen(port, function () {
  console.log(`App is listening on port ${port}`);
});
