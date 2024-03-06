const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { Request, RequestValue, LC } = require('../models');
const uploadUrlToDMS = process.env.UPLOAD_URL_TO_DMS;
const { customerDetailCRN } = require('./channelManager');

const uploadToDMS = async (requestKey, files) => {
  const url = uploadUrlToDMS;
  const formData = new FormData();
  formData.append('document', requestKey);
  files.map((file) => {
    formData.append('files', fs.createReadStream(file.path));
    return true;
  });

  try {
    const { data } = await axios({
      method: 'post',
      url,
      data: formData,
      headers: formData.getHeaders(),
    });
    return {
      success: true,
      data: data.data.attachRes,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};

const addRequiredDetail = async (form, account = '') => {
  switch (form) {
    case 15:
      const detail = await customerDetailCRN(account);
      //if validation error (kyc, dormant) return message
      return [
        { name: 'email', label: 'Email ', value: detail.email },
        { name: 'citizenshipNo', label: 'Citizenship', value: detail.citizenshipNo },
        { name: 'dob', label: 'Date of Birth', value: detail.dob },
        { name: 'address', label: 'Address', value: detail.address },
        { name: 'fatherName', label: 'Father Name', value: detail.fatherName },
        { name: 'motherName', label: 'Mother Name', value: detail.motherName },
        // { name: 'branchSol', label: 'Branch SOL', value: detail.branchSol },
      ];
    default:
      return [];
  }
};

module.exports.createRequest = async (formId, formName, request, requestValues, fileList, requestFiles) => {
  const createdRequest = await Request.create(request);
  let additionalDetail = await addRequiredDetail(formId, requestValues?.account_number);
  requestValues = [...requestValues, ...additionalDetail];
  const requestValuesLength = requestValues.length;
  // restructure files for request
  let result = {};
  requestFiles.map((file) => {
    if (file.fieldname)
      result = { ...result, [file.fieldname]: file.fieldname in result ? [...result?.[file.fieldname], file] : [file] };
  });
  for (let i = 0; i < requestValuesLength; i++) {
    const insertRequestValue = {
      formId,
      requestId: createdRequest.id,
      // name: requestValues[i].name,
      value: JSON.stringify(requestValues[i].value),
    };

    if (requestValues[i].name.includes('fileupload')) {
      const fileField = fileList.find((x) => x.fieldName === requestValues[i].name);
      if (fileField) {
        const promises = Object.entries(result).map(async ([key, files]) => {
          // requestFiles.map(async (file, index) => {

          const reqests_promise = files.map(async (file, index) => {
            const fileInfo = files.find((x) => x.fieldname === requestValues[i].name);

            if (fileInfo) {
              // Create multiple request files.
              insertRequestValue.type = 'file';
              insertRequestValue.name = requestValues[i].name;
              insertRequestValue.label = fileField.label ? fileField.label : requestValues[i].name;
              // const uploadedFileInfo = await uploadToDMS(createdRequest.requestKey, [fileInfo]);
              // fileInfo.url = uploadedFileInfo.data[0].url;
              insertRequestValue.value = JSON.stringify(files[index]);
              try {
                return await RequestValue.create(insertRequestValue);
              } catch (error) {
                console.log('error: ', error);
              }
            }
          });

          return reqests_promise;
        });
        // console.log(reqests_promise);
        await Promise.all(promises);
      }
    } else {
      insertRequestValue.type = 'text';
      insertRequestValue.name = requestValues[i].name;
      insertRequestValue.label = requestValues[i].label ? requestValues[i].label : requestValues[i].name;
      await RequestValue.create(insertRequestValue);
    }
  }
  return createdRequest;
};
