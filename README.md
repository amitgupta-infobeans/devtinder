Initialize the backend project ( devTinder )

    npm init  ( to initialize the node js project.. it is asking few basic question..)
    out project is depend on express and express js is dependent on varoious modules..

    "dependencies":{
    	"express": "^4.19.2"     ^ = caret   (automatic updated our express ( if any patch change or any minor change happend..))
    						    caret automatic allow patch/minor update....

    	"express":"4.19.2"   ==  my project always run on 4.19.2 version

    	"express:"~4.19.2"   ~ is tilde    means:  it allow only patch version update, NOT minor
    }

version of a package means: express has 4.19.2 so this represet 2 = patch version , 19 = minor version and 4 represent major version...
project start from 1.0.0 version... 1.0.0 = patch (versy small change = patch ) then you will increase 1.0.1 and suppose you will do minor change then:
you will add 1.0.0 to 1.1.0

express: 5.10.2" now 5 is a major change... may be breaking changes for the existing express (4.19.2) for our project

package.lock.json : what actual version i am using it is defined in lock.json file... To lock the version you have package.lock.json file..

nodemon: it will automatically refresh the server whenever i make any change...

"start": "node src/app.js" so it will not refresh automatically when we do any chaange in file.. (npm run start)
"dev": "nodemon src/app.js" it will automatically refresh... (npm run dev)

git init
create .gitignore
ignore node_modules
create remote repo on github
push all code to remote origin

git add .
git commit -m "message here"
git remote add origin https://github.com/amitgupta-infobeans/devtinder.git
git branch -M main
git push -u origin main
