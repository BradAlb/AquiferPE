using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aquifer.Models.Requests.Resources
{
    public class ResourceAddRequest
    {
        [Required]
        [MinLength(1)]
        [MaxLength(200)]
        public string Name { get; set; }

        [MinLength(2)]
        [MaxLength(200)]
        public string Headline { get; set; }

        [MinLength(2)]
        [MaxLength(1000)]
        public string Description { get; set; }

        [MinLength(2)]
        [MaxLength(255)]
        public string Logo { get; set; }

        [Required]
        public int ResourceCategoryId { get; set; }

        [Required]
        public int OrgId { get; set; }

        [MinLength(2)]
        [MaxLength(200)]
        public string ContactName { get; set; }

        [MinLength(2)]
        [MaxLength(255)]
        public string ContactEmail { get; set; }

        [MinLength(2)]
        [MaxLength(50)]
        public string Phone { get; set; }

        [MinLength(2)]
        [MaxLength(255)]
        public string SiteUrl { get; set; }
    }
}
