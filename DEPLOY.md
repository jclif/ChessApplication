How to deploy to Linode
=======================

Git Folder into server
------------------------
1. git clone https://github.com/jclif/ChessApplication.git
2. change ownership
3. make production log chmod 06666

Set Up Database
------------------------------
1. drop tables
2. create with chessapp permissions
3. RAILS_ENV=production rake db:drop, rake db:create, rake db:migrate

DELETE ALL TMP FILES
