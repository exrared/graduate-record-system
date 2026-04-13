<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            // Check if columns don't exist before adding
            if (!Schema::hasColumn('activity_logs', 'user_role')) {
                $table->string('user_role', 50)->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('activity_logs', 'action')) {
                $table->string('action', 100)->nullable()->after('user_role');
            }
            if (!Schema::hasColumn('activity_logs', 'module')) {
                $table->string('module', 100)->nullable()->after('action');
            }
            if (!Schema::hasColumn('activity_logs', 'description')) {
                $table->text('description')->nullable()->after('module');
            }
            if (!Schema::hasColumn('activity_logs', 'old_data')) {
                $table->json('old_data')->nullable()->after('description');
            }
            if (!Schema::hasColumn('activity_logs', 'new_data')) {
                $table->json('new_data')->nullable()->after('old_data');
            }
            if (!Schema::hasColumn('activity_logs', 'user_agent')) {
                $table->text('user_agent')->nullable()->after('device');
            }
            
            // Add indexes for faster queries
            $table->index('user_role');
            $table->index('action');
            $table->index('module');
            $table->index('log_date');
        });
    }

    public function down()
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropColumn([
                'user_role', 'action', 'module', 'description', 
                'old_data', 'new_data', 'user_agent'
            ]);
            $table->dropIndex(['user_role', 'action', 'module', 'log_date']);
        });
    }
};