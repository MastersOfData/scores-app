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
};

export enum DataStatus {
  COMPLETED = "completed",
  LOADING = "loading",
  ERROR = "error",
}

export type AppDispatchType = ThunkDispatch<any, undefined, AnyAction> &
  Dispatch<AnyAction>;
