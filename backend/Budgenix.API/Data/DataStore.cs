using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Budgenix.Models;

namespace Budgenix.Data
{
    public class DataStore
    {
        private static  readonly string filePath = "budgenix_data.json";

        public static void Save(AppData data)
        {
            string json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true});
            File.WriteAllText(filePath, json);
        }

        public static AppData Load()
        {
            if (!File.Exists(filePath))
            {
                return new AppData();
            }
            string json = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<AppData>(json) ?? new AppData();
        }
    }
}
