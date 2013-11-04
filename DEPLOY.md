How to deploy to Linode
=======================

TODO
----
* incorporate capistrano

Stop Server and Database Processes
----------------------------------
0. service nginx stop
1. service postgresql stop

Clone App into VPS
------------------
0. Switch user to Chess Application User
1. 'git clone https://github.com/jclif/ChessApplication.git'
2. 'mv ChessApplication/ /var/www/'
3. 'cd /var/www/'
4. Change permissions on ChessApplcation

Set up ENV variables
--------------------
0. 'mv ~/application.yml /var/www/ChessApplication/config/'

Set Up Database
---------------
0. 'RAILS_ENV=production bundle install'
1. 'RAILS_ENV=production rake db:drop'
2. 'RAILS_ENV=production rake db:create'
3. 'RAILS_ENV=production rake db:migrate'
4. 'RAILS_ENV=production rake db:seed'

Precompile Assets
-----------------
0. 'RAILS_ENV=development bundle exec rake assets:precompile'

Start Server and Database Processes
-----------------------------------
0. service nginx start
1. service postgresql start

(Sometimes you have to delete all tmp files)
