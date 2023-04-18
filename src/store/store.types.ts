import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";

export type DataWithStatus<T> = {
  data?: T;
  status: DataStatus;
  create: {
    dataId?: string;
    status: DataStatus;
  };
  update: {
    dataId?: string;
    status: DataStatus;
  };
  delete: {
    status: DataStatus;
  };
  errorMessage?: string;
};

export enum DataStatus {
  COMPLETED = "completed",
  LOADING = "loading",
  ERROR = "error",
}

export type AppDispatchType = ThunkDispatch<unknown, undefined, AnyAction> &
  Dispatch<AnyAction>;
