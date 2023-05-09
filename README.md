**Note:** The project was previously deployed to Heroku. Recently we decided to shift it to AWS. Currently the project has been dockerized. Now looking towards deploying to AWS.

# TypeOrDie
Typing game based on type of the dead.

## Preview

https://github.com/Bruteforceman/TypeOrDie/assets/73040210/2acb5922-6b93-4dc6-809e-9bc4b71cb4aa

## Gameplay

* First login or signup
* You are in your ship. The ships health descreases in some constant rate and the only way to save yourself is by destroying alien ships or meteors in front of you. 
* To destroy an alien ship or meteor, you just need to type in the word above it. But remember to type fast!
* The alien ships change positions after sometime while meteors come downwards constantly.
* If you mistype, the alien ship or meteors comes closer to you and you need to restart typing.


## Game architecture

* We are using React and TypeScript to manage the frontend.
* The backend is written using TypeScript.
* For the database we are using MongoDB.
