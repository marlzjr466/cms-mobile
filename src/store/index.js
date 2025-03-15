import { configureStore } from "@reduxjs/toolkit"
import {reducer} from "../hooks/test"

export const store = configureStore({
    reducer: {
        counter: reducer
    }
})