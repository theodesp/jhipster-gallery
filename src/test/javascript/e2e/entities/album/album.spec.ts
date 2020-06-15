import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import AlbumComponentsPage, { AlbumDeleteDialog } from './album.page-object';
import AlbumUpdatePage from './album-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Album e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let albumComponentsPage: AlbumComponentsPage;
  let albumUpdatePage: AlbumUpdatePage;
  let albumDeleteDialog: AlbumDeleteDialog;
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

  it('should load Albums', async () => {
    await navBarPage.getEntityPage('album');
    albumComponentsPage = new AlbumComponentsPage();
    expect(await albumComponentsPage.title.getText()).to.match(/Albums/);

    expect(await albumComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([albumComponentsPage.noRecords, albumComponentsPage.table]);

    beforeRecordsCount = (await isVisible(albumComponentsPage.noRecords)) ? 0 : await getRecordsCount(albumComponentsPage.table);
  });

  it('should load create Album page', async () => {
    await albumComponentsPage.createButton.click();
    albumUpdatePage = new AlbumUpdatePage();
    expect(await albumUpdatePage.getPageTitle().getAttribute('id')).to.match(/jhgalleryApp.album.home.createOrEditLabel/);
    await albumUpdatePage.cancel();
  });

  it('should create and save Albums', async () => {
    await albumComponentsPage.createButton.click();
    await albumUpdatePage.setTitleInput('title');
    expect(await albumUpdatePage.getTitleInput()).to.match(/title/);
    await albumUpdatePage.setDescriptionInput('description');
    expect(await albumUpdatePage.getDescriptionInput()).to.match(/description/);
    await albumUpdatePage.setCreatedInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await albumUpdatePage.getCreatedInput()).to.contain('2001-01-01T02:30');
    await albumUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(albumUpdatePage.saveButton);
    await albumUpdatePage.save();
    await waitUntilHidden(albumUpdatePage.saveButton);
    expect(await isVisible(albumUpdatePage.saveButton)).to.be.false;

    expect(await albumComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(albumComponentsPage.table);

    await waitUntilCount(albumComponentsPage.records, beforeRecordsCount + 1);
    expect(await albumComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Album', async () => {
    const deleteButton = albumComponentsPage.getDeleteButton(albumComponentsPage.records.last());
    await click(deleteButton);

    albumDeleteDialog = new AlbumDeleteDialog();
    await waitUntilDisplayed(albumDeleteDialog.deleteModal);
    expect(await albumDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/jhgalleryApp.album.delete.question/);
    await albumDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(albumDeleteDialog.deleteModal);

    expect(await isVisible(albumDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([albumComponentsPage.noRecords, albumComponentsPage.table]);

    const afterCount = (await isVisible(albumComponentsPage.noRecords)) ? 0 : await getRecordsCount(albumComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
