using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.ResourceCategories
{
    public class ResourceCategoryAddRequest
    {
        [Required]
        [MaxLength(120)]
        public string Category { get; set; }
    }
}
