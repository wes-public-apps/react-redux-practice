using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using chat_server.hubs;
using Microsoft.Extensions.Configuration;

namespace chat_server
{
    public class Startup
    {
        #region Static Variables
        private static readonly string REACT_CLIENT_CORS_POLICY_NAME = "ReactClientCORSPolicy";
        #endregion

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR();

            services.AddCors(options =>
                options.AddPolicy(Startup.REACT_CLIENT_CORS_POLICY_NAME,
                    builder =>
                        builder.AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins(Configuration.GetSection("CORS")["AllowedOrigins"])
                        .AllowCredentials()));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCors(Startup.REACT_CLIENT_CORS_POLICY_NAME);
            // app.UseDefaultFiles();
            // app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>(Configuration.GetSection("SignalR")["ext"]);
            });
        }
    }
}
