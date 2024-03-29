export enum StatusType {
  LOADING = 'LOADING',
  COMPLETED = 'COMPLETED',
  COMPLETED_BUT_EMPTY = 'COMPLETED_BUT_EMPTY',
  FAILED = 'FAILED',
  DEFAULT = 'DEFAULT',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY'
}

export type StatusTypeNew =
  | 'LOADING'
  | 'COMPLETED'
  | 'COMPLETED_BUT_EMPTY'
  | 'FAILED'
  | 'DEFAULT'
  | 'IN_PROGRESS'
  | 'READY';


export enum AnimationStatus {
  ANIMATIONSTART = 'ANIMATIONSTART',
  DEFAULT = 'DEFAULT'
}

