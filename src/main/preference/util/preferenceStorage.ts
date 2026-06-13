import { IPreference } from "../../../shared/preference/types";
import { FileStorage } from "../../storage/fileStorage";
import { PREFERENCE_CONST } from "../const";

export class PreferenceStorage {
  static readonly APP_PREFERENCE_FILE_NAME = "Preference.json"
  static set(preference: IPreference) {
    FileStorage.writeJson(this.APP_PREFERENCE_FILE_NAME, preference)
  }
  static get(): IPreference {
    return FileStorage.readJson(this.APP_PREFERENCE_FILE_NAME) as IPreference || PREFERENCE_CONST.DEFAULT_PREFERENCE
  }
  static delete() {
    FileStorage.deleteFile(this.APP_PREFERENCE_FILE_NAME)
  }
}