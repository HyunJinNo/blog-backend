export type User = {
  username: string;
  password: string;
};

/*
export default class User {
  private _username: string;
  private _password: string;

  constructor(username: string, password: string) {
    this._username = username;
    this._password = password;
  }

  public get username(): string {
    return this._username;
  }

  public get password(): string {
    return this._password;
  }

  public setPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 10);
    this._password = hash;
  };

  public checkPassword = async (password: string) => {
    const result = await bcrypt.compare(password, this._password);
    return result; // true or false
  };
}
*/
