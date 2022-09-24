using Aquifer.Data;
using Aquifer.Data.Providers;
using Aquifer.Models;
using Aquifer.Models.Domain;
using Aquifer.Models.Domain.Organizations;
using Aquifer.Models.Domain.Resource;
using Aquifer.Models.Requests.Resources;
using Aquifer.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using Aquifer.Models.Interfaces;
using Aquifer.Services;

namespace Aquifer.Services
{
    public class ResourcesService : IResourcesService
    {
        private IAuthenticationService<int> _authService = null;

        IDataProvider _data = null;

        private static IOrganizationService _orgService = null;

        private static ILookUpService _lookUpService = null;
        public ResourcesService(IDataProvider data, ILookUpService lookUpService,
            IAuthenticationService<int> authService, IOrganizationService orgService
            )
        {
            _data = data;
            _authService = authService;
            _lookUpService = lookUpService;
            _orgService = orgService;
        }

        public Resource GetById(int id)
        {
            string procName = "[dbo].[Resources_Select_ById]";

            Resource resource = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                resource = MapSingleResource(reader, ref startingIndex); 
            });

            return resource;
        }

        public Paged<Resource> GetResourcesByCreatedBy(int userId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Resources_Select_ByCreatedBy_Paginated]";

            Paged<Resource> pagedResult = null;

            List<Resource> resources = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@CreatedById", userId);
                parameterCollection.AddWithValue("@pageIndex", pageIndex);
                parameterCollection.AddWithValue("@pageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Resource resource = MapSingleResource(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (resources == null)
                {
                    resources = new List<Resource>();
                }

                resources.Add(resource);
            });

            if (resources != null)
            {
                pagedResult = new Paged<Resource>(resources, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<Resource> GetResourcesByResourceCategoryId(int resourceCatId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Resources_Select_ByResourceCategoryId]";

            Paged<Resource> pagedResult = null;

            List<Resource> resources = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@ResourceCategoryId", resourceCatId);
                parameterCollection.AddWithValue("@pageIndex", pageIndex);
                parameterCollection.AddWithValue("@pageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Resource resource = MapSingleResource(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (resources == null)
                {
                    resources = new List<Resource>();
                }

                resources.Add(resource);
            });

            if (resources != null)
            {
                pagedResult = new Paged<Resource>(resources, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<Resource> GetAllResources(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Resources_SelectAll_Paginated]";

            Paged<Resource> pagedResult = null;

            List<Resource> resources = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@pageIndex", pageIndex);
                parameterCollection.AddWithValue("@pageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Resource resource = MapSingleResource(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (resources == null)
                {
                    resources = new List<Resource>();
                }

                resources.Add(resource);
            });

            if (resources != null)
            {
                pagedResult = new Paged<Resource>(resources, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public ResourceDetails GetResourceByDetailsId(int id)
        {
            string procName = "[dbo].[Resources_Details_ById]";

            ResourceDetails resource = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                resource = MapSingleResourceWithDetails(reader, ref startingIndex);
            });

            return resource;
        }

        public Paged<ResourceDetails> GetResourcesByDetailsLocationTypeId(int locationTypeId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Resources_Details_ByLocationType]";

            Paged<ResourceDetails> pagedResult = null;

            List<ResourceDetails> resources = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@LocationTypeId", locationTypeId);
                parameterCollection.AddWithValue("@PageIndex", pageIndex);
                parameterCollection.AddWithValue("@PageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                ResourceDetails resource = MapSingleResourceWithDetails(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (resources == null)
                {
                    resources = new List<ResourceDetails>();
                }

                resources.Add(resource);
            });

            if (resources != null)
            {
                pagedResult = new Paged<ResourceDetails>(resources, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<ResourceDetails> SearchDetails(int pageIndex, int pageSize, string query)
        {
            string procName = "[dbo].[Resources_Search_Details]";

            Paged<ResourceDetails> pagedResult = null;

            List<ResourceDetails> list = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@Query", query);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                ResourceDetails resource = MapSingleResourceWithDetails(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<ResourceDetails>();
                }
                list.Add(resource);
            });
            if (list != null)
            {
                pagedResult = new Paged<ResourceDetails>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public int Create(ResourceAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Resources_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {

                    AddCommonParams(model, col);
                    col.AddWithValue("@CreatedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    int.TryParse(oId.ToString(), out id);

                });

            return id;
        }

        public void Update(ResourceUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Resources_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@ModifiedBy", userId);
                    col.AddWithValue("@Id", model.Id);
                }, returnParameters: null);
        }

        public void Delete(int id)
        {
            const string procName = "[dbo].[Resources_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, returnParameters: null);
        }

        private static Resource MapSingleResource(IDataReader reader, ref int startingIndex)
        {
            Resource resource = new Resource();
            resource.Id = reader.GetSafeInt32(startingIndex++);
            resource.Name = reader.GetSafeString(startingIndex++);
            resource.Headline = reader.GetSafeString(startingIndex++);
            resource.Description = reader.GetSafeString(startingIndex++);
            resource.Logo = reader.GetSafeString(startingIndex++);
            resource.ResourceCategoryId = reader.GetSafeInt32(startingIndex++);
            resource.OrgId = reader.GetSafeInt32(startingIndex++);
            resource.ContactName = reader.GetSafeString(startingIndex++);
            resource.ContactEmail = reader.GetSafeString(startingIndex++);
            resource.Phone = reader.GetSafeString(startingIndex++);
            resource.SiteUrl = reader.GetSafeString(startingIndex++);
            resource.DateCreated = reader.GetSafeUtcDateTime(startingIndex++);
            resource.DateModified = reader.GetSafeUtcDateTime(startingIndex++);
            resource.CreatedBy = reader.GetSafeInt32(startingIndex++);
            resource.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            return resource;
        }

        private static ResourceDetails MapSingleResourceWithDetails(IDataReader reader, ref int startingIndex)
        {
            ResourceDetails resource = new ResourceDetails();
            resource.Id = reader.GetSafeInt32(startingIndex++);
            resource.Name = reader.GetSafeString(startingIndex++);
            resource.Headline = reader.GetSafeString(startingIndex++);
            resource.Description = reader.GetSafeString(startingIndex++);
            resource.Logo = reader.GetSafeString(startingIndex++);
            resource.ResourceCategory = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            resource.Organization = _orgService.MapSingleOrganization(reader, ref startingIndex);
            resource.ContactName = reader.GetSafeString(startingIndex++);
            resource.ContactEmail = reader.GetSafeString(startingIndex++);
            resource.Phone = reader.GetSafeString(startingIndex++);
            resource.SiteUrl = reader.GetSafeString(startingIndex++);
            resource.DateCreated = reader.GetSafeUtcDateTime(startingIndex++);
            resource.DateModified = reader.GetSafeUtcDateTime(startingIndex++);
            resource.CreatedBy = reader.GetSafeInt32(startingIndex++);
            resource.ModifiedBy = reader.GetSafeInt32(startingIndex++);

            return resource;
        }

        private static void AddCommonParams(ResourceAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Headline", model.Headline);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@Logo", model.Logo);
            col.AddWithValue("@ResourceCategoryId", model.ResourceCategoryId);
            col.AddWithValue("@OrgId", model.OrgId);
            col.AddWithValue("@ContactName", model.ContactName);
            col.AddWithValue("@ContactEmail", model.ContactEmail);
            col.AddWithValue("@Phone", model.Phone);
            col.AddWithValue("@SiteUrl", model.SiteUrl);
        }
       
    }
}
