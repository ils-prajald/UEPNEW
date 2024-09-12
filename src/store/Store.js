import { observable, action, makeObservable } from "mobx";

class Store {
  user = {};
  textData = {};
  cards = {};
  avg7day = {};
  omronUri = "";
  cardUri = "";
  languageList = [];
  packageList = [];
  fileIDsList = [];
  token = "";
  login = 0;
  fileCount = 0;
  isPackageMode = 0;

  constructor() {
    makeObservable(this, {
      user: observable,
      textData: observable,
      cards: observable,
      omronUri: observable,
      token: observable,
      cardUri: observable,
      avg7day: observable,
      languageList: observable,
      packageList: observable,
      fileIDsList: observable,

      fileCount: observable,
      isPackageMode: observable,

      //Actions
      setUser: action,
      setTextData: action,
      setAvg7day: action,
      setGoal: action,
      setCalGoal: action,
      setGoalUnit: action,
      setOmronUri: action,
      setCardUri: action,
      setToken: action,
      setLogged: action,
      clearToken: action,
      setPackageList: action,
      setFileIDsList: action,

      clearPackageList: action,
      setFileCount: action,
      setPackageMode: action,

    });
  }

  setPackageList(packageList) {
    this.packageList = packageList
  }
  setFileIDsList(fileIDsList) {
    this.fileIDsList = fileIDsList
  }
  clearPackageList() {
    this.packageList = []
  }
  setFileCount(fileCount) {
    this.fileCount = fileCount;
  }
  setPackageMode(isPackageMode) {
    this.isPackageMode = isPackageMode;
  }
  setToken(token) {
    this.token = token;
  }

  setLogged(login) {
    this.login = login;
  }

  clearStore() {
    this.user = {};
  }

  clearToken() {
    this.token = "";
  }

  setUser(user) {
    this.user = user;
  }

  setTextData(textData) {
    this.textData = textData;
  }

  setCards(cards) {
    this.cards = cards;
  }

  getGoal() {
    if (this.user.goal) {
      return this.user.goal;
    } else {
      return 6000;
    }
  }
  getCalGoal() {
    if (this.user.goal_calories) {
      return this.user.goal_calories;
    } else {
      return 6000;
    }
  }

  getGoalUnit() {
    if (this.user.goal_unit) {
      return this.user.goal_unit;
    } else {
      return "step";
    }
  }
  getCalGoalUnit() {
    if (this.user.goal_calories_unit) {
      return this.user.goal_calories_unit;
    } else {
      return "calories";
    }
  }

  setGoal(goal) {
    this.user.goal = goal;
  }

  setCalGoal(goal) {
    this.user.goal_calories = goal;
  }

  setGoalUnit(unit) {
    this.user.goal_unit = unit;
  }
  setCalGoalUnit(unit) {
    this.user.goal_calories_unit = unit;
  }

  setAvg7day(data) {
    this.avg7day = data;
  }

  setOmronUri(uri) {
    this.omronUri = uri;
  }

  setCardUri(uri) {
    this.cardUri = uri;
  }

  setLanguageList(langs) {
    this.languageList = langs;
  }
}

const store = new Store();
export { store };
