# Company Corporation LLC Project Repo

## Commiting New Features (Pending Team Approval)

Here is a suggestion for how to commit and merge new features into the repo using the `git` command line tool

1. Pull the latest commits from the `dev` branch
	1. `git checkout dev`
	2. `git pull`

1. Create a new branch for the new feature
	
	`git checkout -b eric/some_feature`

	Creates a new branch and switches to it

1. Push the new branch to origin

	This makes the new branch you made locally available remotely for everyone else

	`git push --set-upstream origin eric/some_feature`

1. Edit/Create the files for your commit

1. Stage the needed files for your commit

	`git add file1.txt file2.py file3.js`

1. Form the commit

	`git commit -m "Added 3 sample files" -m "Here's a description of the commit"`

1. Push the commit

	`git push`

1. When you have enough commits ready for your feature to be implemented, create a Pull Request to merge your new branch into `dev`

1. Someone else on the team reviews your Pull Request and approves it

1. The new branch can be merged into `dev`

1. At the end of the sprint, `dev` is merged into `main`