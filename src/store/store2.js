import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import modalReducer from "../store/modalSlice";
import assignMovieModalReducer from "../store/assignMovieModalSlice";
import movieReducer from "../store/movieSlice";
import languageReducer from "../store/languageSlice";
import categoryReducer from "../store/categorySlice";
import backgroundDataReducer from "../store/backgroundDataSlice";
import distributorReducer from "../store/distributorSlice";
import offerReducer from "../store/offerSlice";
import boxOfficeReducer from "../store/boxOfficeSlice";
import foodReducer from "../store/foodSlice";
import bookingReducer from "../store/bookingSlice";
import taxManageReducer from "./taxManageSlice";
import roleReducer from "./roleSlice";
import userReducer from "./userSlice";
import mailTemplateReducer from "./mailTemplateSlice";
import notificationTemplateReducer from "./notificationTemplateSlice";
import pageReducer from "./pageSlice";
import faqReducer from "./faqSlice";
import movieTicketReducer from "./movieTicketSlice";
import assignBunchReducer from "./assignBunchSlice";
import boxOfficeCounterReducer from "./boxOfficeCounterSlice";
import foodStoreReducer from "./foodStoreSlice";

import storage from "./storage";
import { persistReducer, persistStore } from "redux-persist";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const settingPersistConfig = {
  key: "backgroundData",
  storage,
  whitelist: ["setting"],
};

const boxOfficeCounterPersistConfig = {
  key: "box_counter",
  storage,
  whitelist: ["remaining_counter_bunch_ticket"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedSettingReducer = persistReducer(settingPersistConfig, backgroundDataReducer);
const persistedBoxOfficeCounterReducer = persistReducer(boxOfficeCounterPersistConfig, boxOfficeCounterReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    modal: modalReducer,
    assignMovie: assignMovieModalReducer,
    movies: movieReducer,
    languages: languageReducer,
    categories: categoryReducer,
    backgroundData: persistedSettingReducer,
    distributors: distributorReducer,
    offers: offerReducer,
    boxoffice: boxOfficeReducer,
    foods: foodReducer,
    bookings: bookingReducer,
    taxmanage: taxManageReducer,
    role: roleReducer,
    users: userReducer,
    mail_templates: mailTemplateReducer,
    notification_templates: notificationTemplateReducer,
    page: pageReducer,
    faqs: faqReducer,
    movie_ticket: movieTicketReducer,
    bunch: assignBunchReducer,
    box_office_counter: persistedBoxOfficeCounterReducer,
    food_store: foodStoreReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);