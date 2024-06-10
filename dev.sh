./start-database.sh

yarn startdb
yarn db:generate
yarn db:push
yarn db:seed
yarn dev
