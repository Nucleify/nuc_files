import type {
  DeleteEntityRequestType,
  EditEntityRequestType,
  EntityCountResultsType,
  EntityResultsType,
  GetAllEntitiesRequestType,
  GetEntityRequestType,
  LoadingRefType,
  NucFileObjectInterface,
  StoreEntityRequestType,
} from 'nucleify'

export interface NucFileRequestsInterface {
  results: EntityResultsType<NucFileObjectInterface>
  createdLastWeek: EntityCountResultsType
  loading: LoadingRefType
  getAllFiles: GetAllEntitiesRequestType<NucFileObjectInterface>
  getCountFilesByCreatedLastWeek: GetEntityRequestType
  storeFile: StoreEntityRequestType<NucFileObjectInterface>
  editFile: EditEntityRequestType<NucFileObjectInterface>
  deleteFile: DeleteEntityRequestType
}
