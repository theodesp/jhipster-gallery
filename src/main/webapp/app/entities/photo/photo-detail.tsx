import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './photo.reducer';
import { IPhoto } from 'app/shared/model/photo.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPhotoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PhotoDetail = (props: IPhotoDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { photoEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="jhgalleryApp.photo.detail.title">Photo</Translate> [<b>{photoEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="title">
              <Translate contentKey="jhgalleryApp.photo.title">Title</Translate>
            </span>
          </dt>
          <dd>{photoEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="jhgalleryApp.photo.description">Description</Translate>
            </span>
          </dt>
          <dd>{photoEntity.description}</dd>
          <dt>
            <span id="image">
              <Translate contentKey="jhgalleryApp.photo.image">Image</Translate>
            </span>
          </dt>
          <dd>
            {photoEntity.image ? (
              <div>
                {photoEntity.imageContentType ? (
                  <a onClick={openFile(photoEntity.imageContentType, photoEntity.image)}>
                    <img src={`data:${photoEntity.imageContentType};base64,${photoEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {photoEntity.imageContentType}, {byteSize(photoEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="height">
              <Translate contentKey="jhgalleryApp.photo.height">Height</Translate>
            </span>
          </dt>
          <dd>{photoEntity.height}</dd>
          <dt>
            <span id="width">
              <Translate contentKey="jhgalleryApp.photo.width">Width</Translate>
            </span>
          </dt>
          <dd>{photoEntity.width}</dd>
          <dt>
            <span id="taken">
              <Translate contentKey="jhgalleryApp.photo.taken">Taken</Translate>
            </span>
          </dt>
          <dd>{photoEntity.taken ? <TextFormat value={photoEntity.taken} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="uploaded">
              <Translate contentKey="jhgalleryApp.photo.uploaded">Uploaded</Translate>
            </span>
          </dt>
          <dd>{photoEntity.uploaded ? <TextFormat value={photoEntity.uploaded} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="jhgalleryApp.photo.album">Album</Translate>
          </dt>
          <dd>{photoEntity.album ? photoEntity.album.title : ''}</dd>
          <dt>
            <Translate contentKey="jhgalleryApp.photo.tag">Tag</Translate>
          </dt>
          <dd>
            {photoEntity.tags
              ? photoEntity.tags.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.name}</a>
                    {photoEntity.tags && i === photoEntity.tags.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/photo" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/photo/${photoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ photo }: IRootState) => ({
  photoEntity: photo.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetail);
