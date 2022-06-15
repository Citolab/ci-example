/**
 * # This class is all about
 * - Configuration of your interaction with key value pairs in config.json
 * - Setting up the state of your interaction with a store
 * - Getting the initial response for setting your state
 * - Setting the response on state changes
 * - Importing the main style and attaching it under your domnode
 * - Render your interaction
 * 
 * ## Then comes the fun part, the interaction is just a (p)react component
 * - Uses the store
 * - Can write JSX, so HTML with tailwind classes and import react libraries
 * - Import Images, Svg
 * - Just like any other react project
 */
import { render } from "preact"; // for rendering your interaction as a react component ( could use another renderer if you want )
import { Configuration } from "@citolab/tspci"; // the configuration object of a PCI, please use this for future sake
import { CES, CI } from "@citolab/tspci-questify"; // Interfaces so you can easily remember their implementation details
import { initStore, Store } from "@citolab/preact-store"; // A store, always use a store to manage the interactions state
import { actions, StateModel } from "./store"; // your definition of the store

// our interaction, a preact component
import { Interaction } from "./interaction";

// assets, css and config json
import style from "./style.css";
import configProps from "./config.json";
type PropTypes = typeof configProps;

// the ces object of face, should be floating here somewhere
const ces: CES = window["CES"]
  ? window["CES"]
  : window.parent["CES"]
  ? window.parent["CES"]
  : console.log("no QTI player found");

// our app
class App implements CI<PropTypes> {
  typeIdentifier = "colorProportions";  // the identifier for this pci, same as in your package.json
  store: Store<StateModel>; // a universal, global state for all of your pci to enjoy
  shadowdom: ShadowRoot; // aha, a shadowroot.. all html and styles neatly packed under a safe shadowroot
  config: Configuration<PropTypes>; // a config object, like any other config object in the pci world

  constructor() {
    // okay, lets force you guys to call the getInstance, because later, you will be using this for your pcis
    this.getInstance(document.body, { properties: configProps, onready: () => {} }, ces.getResponse());
  }

  // best practice to use this method for now, you'd be ready for PCI's in no time
  getInstance = (dom: HTMLElement, config: Configuration<PropTypes>, stateString: string) => {
    this.shadowdom = dom.attachShadow({ mode: "closed" }); // first let us create a shadowroot under our dom, just for safety

    config.properties = { ...configProps, ...config.properties }; // then merge your own config with the players ( if any )
    this.config = config; // retain the config

    const initState: StateModel = stateString ? JSON.parse(stateString).state : { vlakken: [] }; // then create an empty state if none exists

    // this state, including actions on the state, and a callback for storing belongs in a store
    this.store = initStore<StateModel>( // use the store luke
      actions,  // some actions to mutate the state in the store
      initState, // some initial state to begin with
      (action) => ces.setResponse(JSON.stringify({ state: this.store.getState() })) // and add a callback function, if the state changes, store it back in de CES object
    );

    // all is ready!
    this.render();
  };
  
  // render the shizzle ( and let preact do its magic )
  render = () => {
    render(null, this.shadowdom); // empty everything under the shadowdom
    const css = document.createElement("style"); // for appending imported styles
    css.innerHTML = style; // the imported style
    this.shadowdom.appendChild(css); // and place it under the shadowroot, NEAT! no leaked styles
    render(<Interaction config={this.config.properties} dom={this.shadowdom} />, this.shadowdom); // let preact render its components
  };
}

window.onload =function() {
  new App();
};