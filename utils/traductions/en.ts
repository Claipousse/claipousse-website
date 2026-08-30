export const en = {
  menu: {
    greeting: "hi! i'm claipousse :)",
    item: {
      gallery: "gallery",
      links: "links",
      myroom: "my room",
      mypc: "my pc",
    },
  },
  entergate: {
    prefix: "Move along, nothing to see here.... or maybe.... try",
    verbFine: "clicking",
    verbCoarse: "tapping",
    suffix: "the screen to see?",
  },
  mobilewarning: {
    title: "hey there!",
    body: "just wanted to let you know that the website works best on desktop, some features may look a little odd on mobile",
    button: "okay",
  },
  gallery: {
    category: {
      cats: "my cats",
      cooking: "cooking",
      gardening: "gardening",
      cs: "computer science",
      other: "other",
    },
    back: "back",
  },
  mypc: {
    boot: {
      title: "CLAIPOUSSE-OS",
      user: "user",
      password: "password",
    },
    shutdown: "shutdown",
    icon: {
      aboutme: "about me",
      videogames: "videogames",
      music: "music",
      manganime: "manganime",
      draw: "draw",
      contact: "contact",
      meowl: "meowl",
      todo: "to-do",
      credits: "credits",
      help: "help",
    },
  },
  aboutme: {
    name: { line1: "CLAIPOUSSE /", line2: "CLEM" },
    intro: "hi ! i'm claipousse, i ...",
    fact1: "have two beautifuls cats",
    fact2: "study computer science",
    fact3: "am using fedora on my desktop and pop!_OS on my laptop",
    hobbiesTitle: "HOBBIES",
    hobby1: "homelabbing",
    hobby2: "gardening",
    hobby3: "cooking",
    hobby4: "drawing stupid things",
    hobby5: "handcrafting",
    hobby6: "building PCs for friends",
    languagesTitle: "LANGUAGES",
    languagesText:
      "french is my native language, i also speak english well (even if my spoken English isn't great), i learned spanish in high school but i was the worst student in my class",
  },
  videogames: {
    favorites: "my favorites games",
    currentlyPlaying: "games i currently play",
    other: "other games i like",
    descriptionP4G: "(i'm trying to finish it before revival)",
    descriptionLol:
      "(feel like a fent addict who keeps playing it even if i know it's awful for my mental sanity)",
  },
  music: {
    albums: "albums i like",
  },
  settings: {
    music: "music",
    sfx: "sfx",
    language: "english",
  },
  manganime: {
    favorites: "My favorites animes / mangas",
    currentlyWatching: "currently watching / reading",
    loadError: "ouch... my anime list couldn't load, try again later...",
    loading: "loading...",
    nothingRightNow: "tung tung tung gtfo",
    everythingElse: "everything else i've watched / read",
    disclaimer:
      "this list is based on myanimelist, it may be incomplete with several animes/mangas omitted by mistake",
  },
  contact: {
    text: "if you'd like to contact me for any reason, you can use the email address above :)",
  },
  todo: {
    title: "WHAT I AM WORKING ON / PLANNING TO DO :",
    item1: "finishing the my room section.",
    item2: "searching a new background for the main menu",
    item3: "adding fullscreen & minimize (=close) function to the windows on my pc",
    item4: "adding a space for sharing messages or drawings between visitors",
    item5: "adding a space to share my drawings (or i'll do a pixiv lol)",
    item6:
      "learn the basics of animation to make my own animated icons (ex: music on/off button in the main menu)",
    item7: "adding new photos on gallery",
    item8: "create an icon in My PC for sharing content from my TikTok account",
    item9: "fixing bugs that people report to me",
    item10: "adding an export function to the draw page",
    footer:
      "if you'd like to give me feedback or suggest ideas, feel free to contact me via the email on the \"contact\" page",
  },
  help: {
    title: "HOW IT WORKS ?",
    text1:
      "welcome to my computer ! explore it by clicking on the icons to open windows, and close them using the x in the top-right corner of the pages. you can turn on and off the music with the button in the bottom-right corner, when you're done, you can use the shutdown button in the bottom-left corner of the screen :)",
    text2:
      "if you're on a desktop, you can open multiple windows at once and move them by dragging the header, but if you're on a mobile device, only one window will open at a time in full-screen mode.",
  },
  credits: {
    section: {
      models: "3d models",
      fonts: "fonts",
      musics: "musics",
      icons: "icons",
      cursors: "cursors",
      background: "background",
    },
    mainMenu: "main menu",
    fontsText:
      "i use {Bestime} for the main menu and {Grape Soda} for the my pc section (the one you are reading now)",
    iconsText: "all icons are from {icons8.com} or i made them myself",
    cursorsText: "the cursors on this desktop are {Retro Cursor} by {Jeelh}",
    backgroundText: "the background of the main menu is from omori (found it on wallpaper engine)",
    linksNote: "i created my own board, but the reference i used is :",
  },
};

export type Dict = typeof en;