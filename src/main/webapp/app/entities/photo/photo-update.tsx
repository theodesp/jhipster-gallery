import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IAlbum } from 'app/shared/model/album.model';
import { getEntities as getAlbums } from 'app/entities/album/album.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './photo.reducer';
import { IPhoto } from 'app/shared/model/photo.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPhotoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PhotoUpdate = (props: IPhotoUpdateProps) => {
  const [idstag, setIdstag] = useState([]);
  const [albumId, setAlbumId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { photoEntity, albums, tags, loading, updating } = props;

  const { description, image, imageContentType } = photoEntity;

  const handleClose = () => {
    props.history.push('/photo');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getAlbums();
    props.getTags();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.taken = convertDateTimeToServer(values.taken);
    values.uploaded = convertDateTimeToServer(values.uploaded);

    if (errors.length === 0) {
      const entity = {
        ...photoEntity,
        ...values,
        tags: mapIdList(values.tags),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="jhgalleryApp.photo.home.createOrEditLabel">
            <Translate contentKey="jhgalleryApp.photo.home.createOrEditLabel">Create or edit a Photo</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : photoEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="photo-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="photo-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="photo-title">
                  <Translate contentKey="jhgalleryApp.photo.title">Title</Translate>
                </Label>
                <AvField
                  id="photo-title"
                  type="text"
                  name="title"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="photo-description">
                  <Translate contentKey="jhgalleryApp.photo.description">Description</Translate>
                </Label>
                <AvInput id="photo-description" type="textarea" name="description" />
              </AvGroup>
              <AvGroup>
                <AvGroup>
                  <Label id="imageLabel" for="image">
                    <Translate contentKey="jhgalleryApp.photo.image">Image</Translate>
                  </Label>
                  <br />
                  {image ? (
                    <div>
                      {imageContentType ? (
                        <a onClick={openFile(imageContentType, image)}>
                          <img src={`data:${imageContentType};base64,${image}`} style={{ maxHeight: '100px' }} />
                        </a>
                      ) : null}
                      <br />
                      <Row>
                        <Col md="11">
                          <span>
                            {imageContentType}, {byteSize(image)}
                          </span>
                        </Col>
                        <Col md="1">
                          <Button color="danger" onClick={clearBlob('image')}>
                            <FontAwesomeIcon icon="times-circle" />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  <input id="file_image" type="file" onChange={onBlobChange(true, 'image')} accept="image/*" />
                  <AvInput
                    type="hidden"
                    name="image"
                    value={image}
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                    }}
                  />
                </AvGroup>
              </AvGroup>
              <AvGroup>
                <Label id="heightLabel" for="photo-height">
                  <Translate contentKey="jhgalleryApp.photo.height">Height</Translate>
                </Label>
                <AvField id="photo-height" type="string" className="form-control" name="height" />
              </AvGroup>
              <AvGroup>
                <Label id="widthLabel" for="photo-width">
                  <Translate contentKey="jhgalleryApp.photo.width">Width</Translate>
                </Label>
                <AvField id="photo-width" type="string" className="form-control" name="width" />
              </AvGroup>
              <AvGroup>
                <Label id="takenLabel" for="photo-taken">
                  <Translate contentKey="jhgalleryApp.photo.taken">Taken</Translate>
                </Label>
                <AvInput
                  id="photo-taken"
                  type="datetime-local"
                  className="form-control"
                  name="taken"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.photoEntity.taken)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="uploadedLabel" for="photo-uploaded">
                  <Translate contentKey="jhgalleryApp.photo.uploaded">Uploaded</Translate>
                </Label>
                <AvInput
                  id="photo-uploaded"
                  type="datetime-local"
                  className="form-control"
                  name="uploaded"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.photoEntity.uploaded)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="photo-album">
                  <Translate contentKey="jhgalleryApp.photo.album">Album</Translate>
                </Label>
                <AvInput id="photo-album" type="select" className="form-control" name="album.id">
                  <option value="" key="0" />
                  {albums
                    ? albums.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.title}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="photo-tag">
                  <Translate contentKey="jhgalleryApp.photo.tag">Tag</Translate>
                </Label>
                <AvInput
                  id="photo-tag"
                  type="select"
                  multiple
                  className="form-control"
                  name="tags"
                  value={photoEntity.tags && photoEntity.tags.map(e => e.id)}
                >
                  <option value="" key="0" />
                  {tags
                    ? tags.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/photo" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  albums: storeState.album.entities,
  tags: storeState.tag.entities,
  photoEntity: storeState.photo.entity,
  loading: storeState.photo.loading,
  updating: storeState.photo.updating,
  updateSuccess: storeState.photo.updateSuccess,
});

const mapDispatchToProps = {
  getAlbums,
  getTags,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PhotoUpdate);
