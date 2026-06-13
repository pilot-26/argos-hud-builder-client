import { IPreference } from "../../shared/preference/types"
import { PREFERENCE_CONST } from "./const"
import { PreferenceStorage } from "./util/preferenceStorage"

export class PreferenceManager {
  static preference: IPreference = PREFERENCE_CONST.DEFAULT_PREFERENCE

  static load() {
    this.preference = PreferenceStorage.get()
  }

  static save() {
    PreferenceStorage.set(this.preference)
  }
}