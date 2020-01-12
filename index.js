/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const VGLIST_URL = "https://vglist.co";
// const VGLIST_URL = "http://localhost:3000";

/**
 * Stupid vglist VR Viewer component for A-Frame.
 */
AFRAME.registerComponent('stupid-vglist-vr-viewer', {
  schema: {},

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: async function() {
    let username = 'connor';
    let gamePurchases = await getGamePurchases(username);
    console.log(gamePurchases['nodes']);

    let sceneEl = document.querySelector('a-scene');
    let assetsEl = document.createElement('a-assets');

    let xPosition = 0;
    gamePurchases['nodes'].forEach(() => {
      let img = document.createElement('img');
      img.setAttribute('src', `${VGLIST_URL}${gamePurchases['nodes'][0]['game']['coverUrl']}`);
      img.setAttribute('id', 'img1');
      img.setAttribute('crossorigin', 'anonymous');
      assetsEl.appendChild(img);

      let entityEl = document.createElement('a-box');
      // Do `.setAttribute()`s to initialize the entity.
      entityEl.setAttribute('src', '#img1');
      entityEl.setAttribute('geometry', {
        primitive: 'box',
        height: 4,
        width: 3,
        depth: 0.25
      });
      entityEl.setAttribute('position', { x: xPosition, y: 2, z: -4 });
      sceneEl.appendChild(entityEl);
      xPosition += 3.5;
    });

    sceneEl.appendChild(assetsEl);
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { },

  /**
   * Event handlers that automatically get attached or detached based on scene state.
   */
  events: {
    // click: function (evt) { }
  }
});

async function getGamePurchases(username) {
  const query = /* GraphQL */ `{
    user(username: "${username}") {
      gamePurchases {
        nodes {
          game {
            name
            coverUrl
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }`;

  let email = VGLIST_USER_EMAIL;
  let token = VGLIST_API_TOKEN;
  let endpoint = `${VGLIST_URL}/graphql`;

  let gamePurchases = [];

  return await fetch(endpoint, {
    method: 'POST',
    headers: {
      "User-Agent": "Stupid vglist VR Viewer",
      "X-User-Email": email,
      "X-User-Token": token,
      'Content-Type': 'application/json',
      "Accept": "*/*"
    },
    body: JSON.stringify({ query: query })
  }).then(response => response.json())
    .then(data => {
      gamePurchases = data['data']['user']['gamePurchases'];
      return gamePurchases;
    });
}
