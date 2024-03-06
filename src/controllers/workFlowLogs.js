const { WorkflowLog, Request, WorkflowFiles } = require('../models');
const { HTTP } = require('../constants/response');
const db = require('../config/database');
const { respond } = require('../utils/response');

const store = async (req, res) => {
  try {
    let commentType;
    commentType = req.body?.submitType && req.body.submitType == 'commentOnly' ? true : false;

    const log = await WorkflowLog.create({
      requestId: req.body.requestId,
      groupId: req.body.groupId,
      nextGroupId: req.body.nextGroupId,
      currentUserId: req.body.currentUserId,
      actionId: commentType ? 11 : req.body.actionId,
      comment: req.body.comment,
    });

    if(!commentType){
    await Request.update(
      {
        statusId: 2,
      },
      {
        where: {
          id: req.body.requestId,
        },
      }
    );
  }

    let files = req.files;
    if (files) {
      files.map(async (file) => {
        // below line will upload file to dms
        // const uploadedFileInfo = await uploadToDMS(requestKey, [file]);
        const fileInfo = {
          workflowLogId: log.id,
          originalName: file.originalname,
          mimeType: file.mimetype,
          path: file.path,
          filename: file.filename,
          size: file.size,
          // below line will upload file to dms
          // url: uploadedFileInfo.data[0].url,
        };
        await WorkflowFiles.create(fileInfo);
      });
    }
    return respond(res, HTTP.StatusOk, 'Comment submitted successfully.');
  } catch (e) {
    // console.log(e);
    return respond(res, HTTP.StatusInternalServerError, 'Failed to create comment.');
  }
};
module.exports = {
  store,
};
