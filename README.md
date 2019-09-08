# JAM CODE CHALLENGE

Candidate: Hugo Cattelain

## Getting started

To run the project locally, run the following commands :

- npm install
- npm start

If the last command does not automatically open the app in your browser, follow this URL: http://localhost:3000/

## Choices & dependencies

React has been chosen over Vue for convenience.

The code demonstrates the usage of 2 types of styling :

- Classic SCSS
- CSS in JS

The BEM class naming convention was used for this challenge (http://getbem.com/)

The main librarie used for the UI components is Material-ui (https://material-ui.com/)

Only the Player component is stateful, the rest of the components are stateless functional components.

NB: The test instructions contains incorrect information; the comment endpoint is the same as the like endpoint. Therefore, the comment endpoint has been deduced by replacing 'interact/like' by 'interact/comment'. However, the candidate can't confirm that the endpoint URL is exact. Also, the server has not been correctly configured to accept non-logged in Request (response code is 401: Unauthorized) so the requests to the '/song/like' and '/song/comment' endpoints are sent with the 'no-cors' mode. Finally, no information was given about the way parametters should be sent for the last mentioned endpoints, therefore the candidate assumed the parameters such as id, message and type should be passed in the request body.

Appart from the existing test in './src/App.test.js', no additional test has been written.

## Features

When the user enter the App, the song list gets fetched and the first track gets selected. The user can play a song, like it and comment it. From the bottom app-bar, the user can also change the play time and adjust the volume level.
Once a song ends, the next one gets played. When the last song of the list ends, the first song gets played.

## Drawback & improvement

The App does not store any data (last played song, last selected volume level, time progress of the last played song when the user closed the app). Therefore, if the user reload the page during the signup process, none of these parameters will be recovered.

To fix this issue, we could set up a Redux global store and save the App data in the browser local storage. On page reload, we could retrieve these data and update the view.
