import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PhotoComponentsPage, { PhotoDeleteDialog } from './photo.page-object';
import PhotoUpdatePage from './photo-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('Photo e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let photoComponentsPage: PhotoComponentsPage;
  let photoUpdatePage: PhotoUpdatePage;
  let photoDeleteDialog: PhotoDeleteDialog;
  const fileToUpload = '../../../../../../src/main/webapp/content/images/logo-jhipster.png';
  const absolutePath = path.resolve(__dirname, fileToUpload);
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Photos', async () => {
    await navBarPage.getEntityPage('photo');
    photoComponentsPage = new PhotoComponentsPage();
    expect(await photoComponentsPage.title.getText()).to.match(/Photos/);

    expect(await photoComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([photoComponentsPage.noRecords, photoComponentsPage.table]);

    beforeRecordsCount = (await isVisible(photoComponentsPage.noRecords)) ? 0 : await getRecordsCount(photoComponentsPage.table);
  });

  it('should load create Photo page', async () => {
    await photoComponentsPage.createButton.click();
    photoUpdatePage = new PhotoUpdatePage();
    expect(await photoUpdatePage.getPageTitle().getAttribute('id')).to.match(/jhgalleryApp.photo.home.createOrEditLabel/);
    await photoUpdatePage.cancel();
  });

  it('should create and save Photos', async () => {
    await photoComponentsPage.createButton.click();
    await photoUpdatePage.setTitleInput('title');
    expect(await photoUpdatePage.getTitleInput()).to.match(/title/);
    await photoUpdatePage.setDescriptionInput('description');
    expect(await photoUpdatePage.getDescriptionInput()).to.match(/description/);
    await photoUpdatePage.setImageInput(absolutePath);
    await photoUpdatePage.setHeightInput('5');
    expect(await photoUpdatePage.getHeightInput()).to.eq('5');
    await photoUpdatePage.setWidthInput('5');
    expect(await photoUpdatePage.getWidthInput()).to.eq('5');
    await photoUpdatePage.setTakenInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await photoUpdatePage.getTakenInput()).to.contain('2001-01-01T02:30');
    await photoUpdatePage.setUploadedInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await photoUpdatePage.getUploadedInput()).to.contain('2001-01-01T02:30');
    await photoUpdatePage.albumSelectLastOption();
    // photoUpdatePage.tagSelectLastOption();
    await waitUntilDisplayed(photoUpdatePage.saveButton);
    await photoUpdatePage.save();
    await waitUntilHidden(photoUpdatePage.saveButton);
    expect(await isVisible(photoUpdatePage.saveButton)).to.be.false;

    expect(await photoComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(photoComponentsPage.table);

    await waitUntilCount(photoComponentsPage.records, beforeRecordsCount + 1);
    expect(await photoComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Photo', async () => {
    const deleteButton = photoComponentsPage.getDeleteButton(photoComponentsPage.records.last());
    await click(deleteButton);

    photoDeleteDialog = new PhotoDeleteDialog();
    await waitUntilDisplayed(photoDeleteDialog.deleteModal);
    expect(await photoDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/jhgalleryApp.photo.delete.question/);
    await photoDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(photoDeleteDialog.deleteModal);

    expect(await isVisible(photoDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([photoComponentsPage.noRecords, photoComponentsPage.table]);

    const afterCount = (await isVisible(photoComponentsPage.noRecords)) ? 0 : await getRecordsCount(photoComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
