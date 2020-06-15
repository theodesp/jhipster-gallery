import { element, by, ElementFinder } from 'protractor';

export default class PhotoUpdatePage {
  pageTitle: ElementFinder = element(by.id('jhgalleryApp.photo.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#photo-title'));
  descriptionInput: ElementFinder = element(by.css('textarea#photo-description'));
  imageInput: ElementFinder = element(by.css('input#file_image'));
  heightInput: ElementFinder = element(by.css('input#photo-height'));
  widthInput: ElementFinder = element(by.css('input#photo-width'));
  takenInput: ElementFinder = element(by.css('input#photo-taken'));
  uploadedInput: ElementFinder = element(by.css('input#photo-uploaded'));
  albumSelect: ElementFinder = element(by.css('select#photo-album'));
  tagSelect: ElementFinder = element(by.css('select#photo-tag'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTitleInput(title) {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput() {
    return this.titleInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setImageInput(image) {
    await this.imageInput.sendKeys(image);
  }

  async getImageInput() {
    return this.imageInput.getAttribute('value');
  }

  async setHeightInput(height) {
    await this.heightInput.sendKeys(height);
  }

  async getHeightInput() {
    return this.heightInput.getAttribute('value');
  }

  async setWidthInput(width) {
    await this.widthInput.sendKeys(width);
  }

  async getWidthInput() {
    return this.widthInput.getAttribute('value');
  }

  async setTakenInput(taken) {
    await this.takenInput.sendKeys(taken);
  }

  async getTakenInput() {
    return this.takenInput.getAttribute('value');
  }

  async setUploadedInput(uploaded) {
    await this.uploadedInput.sendKeys(uploaded);
  }

  async getUploadedInput() {
    return this.uploadedInput.getAttribute('value');
  }

  async albumSelectLastOption() {
    await this.albumSelect.all(by.tagName('option')).last().click();
  }

  async albumSelectOption(option) {
    await this.albumSelect.sendKeys(option);
  }

  getAlbumSelect() {
    return this.albumSelect;
  }

  async getAlbumSelectedOption() {
    return this.albumSelect.element(by.css('option:checked')).getText();
  }

  async tagSelectLastOption() {
    await this.tagSelect.all(by.tagName('option')).last().click();
  }

  async tagSelectOption(option) {
    await this.tagSelect.sendKeys(option);
  }

  getTagSelect() {
    return this.tagSelect;
  }

  async getTagSelectedOption() {
    return this.tagSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
