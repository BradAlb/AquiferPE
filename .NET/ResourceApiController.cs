
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Aquifer.Services.Interfaces;
using System;
using Aquifer.Web.Controllers;
using Aquifer.Web.Models.Responses;
using Aquifer.Models;
using Aquifer.Models.Requests.Resources;
using Aquifer.Models.Domain.Resource;

namespace Aquifer.Services
{
    [Route("api/resources")]
    [ApiController]
    public class ResourceApiController : BaseApiController
    {
        private IResourcesService _service = null;
        private ILookUpService _lookUpService = null;
        private IAuthenticationService<int> _authService = null;
        public ResourceApiController(IResourcesService service, ILookUpService lookUpService
            , ILogger<IResourcesService> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
            _lookUpService = lookUpService;
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Resource>> GetResourceById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Resource resource = _service.GetById(id);

                if (resource == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }

                else
                {
                    response = new ItemResponse<Resource> { Item = resource };
                   
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");

            }
            return StatusCode(iCode, response);
        }

        [AllowAnonymous]
        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<Resource>>> GetResourcesByCreatedBy(int userId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Resource> list = _service.GetResourcesByCreatedBy(userId, pageIndex, pageSize);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [AllowAnonymous]
        [HttpGet("type")]
        public ActionResult<ItemResponse<Paged<Resource>>> GetResourcesByResourceCategoryId(int resourceCatId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Resource> list = _service.GetResourcesByResourceCategoryId(resourceCatId, pageIndex, pageSize);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [AllowAnonymous]
        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Resource>>> GetAllResources(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Resource> list = _service.GetAllResources(pageIndex, pageSize);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Resource>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [AllowAnonymous]
        [HttpGet("details")]
        public ActionResult<ItemResponse<ResourceDetails>> GetResourceByDetailsId(int resourceId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                ResourceDetails resource = _service.GetResourceByDetailsId(resourceId);

                if (resource == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }

                else
                {
                    response = new ItemResponse<ResourceDetails> { Item = resource };

                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");

            }
            return StatusCode(iCode, response);
        }

        [AllowAnonymous]
        [HttpGet("locationtype")]
        public ActionResult<ItemResponse<Paged<ResourceDetails>>> GetResourcesByDetailsLocationTypeId(int locationTypeId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<ResourceDetails> list = _service.GetResourcesByDetailsLocationTypeId(locationTypeId, pageIndex, pageSize);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<ResourceDetails>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<ResourceDetails>>> Search(int pageIndex, int pageSize, string query)
        {
            ActionResult result = null;
            try
            {
                Paged<ResourceDetails> paginated = _service.SearchDetails(pageIndex, pageSize, query);
                if (paginated == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<ResourceDetails>> response = new ItemResponse<Paged<ResourceDetails>>();
                    response.Item = paginated;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(ResourceAddRequest model)
        {
            int userId = _authService.GetCurrentUserId();

            ObjectResult result = null;

            try
            {
                int id = _service.Create(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(ResourceUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _service.Update(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;

                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;

                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
    }
}
